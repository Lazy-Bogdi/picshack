<?php

namespace App\Controller;

use App\Entity\Image;
use App\DTO\ImageStatusDTO;
use App\DTO\ImageUploadDTO;
use Symfony\Component\Uid\Uuid;
use App\Repository\ImageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class ImageController extends AbstractController
{
    #[Route('/api/upload', name: 'image_upload', methods: ['POST'])]
    public function upload(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): Response
    {

        $dto = new ImageUploadDTO();
        $dto->imageFile = $request->files->get('imageFile');
        $dto->isPublic = $request->request->get('isPublic', true); // Assume JSON or form data

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }

        $image = new Image();
        try {
            $uuid = Uuid::v4()->toRfc4122();
            $image->setImageFile($dto->imageFile);
            $image->setCreatedAt(new \DateTimeImmutable());
            $image->setUniqueId("img_" . $uuid);
            $image->setIsPublic($dto->isPublic);
            $image->setOwner($this->getUser());

            $entityManager->persist($image);
            $entityManager->flush();

            return $this->json(
                [
                    'message' => 'Image uploaded successfully',
                    'image' => $serializer->serialize($image, 'json', ['groups' => ['image:read']])
                ],
                Response::HTTP_CREATED,
                ['Content-Type' => 'application/json']

            );
        } catch (FileException $e) {
            return $this->json(['error' => 'Failed to upload image: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Server error: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/public-images', name: 'public_images', methods: ['GET'])]
    public function getPublicImages(ImageRepository $imageRepository, SerializerInterface $serializer): Response
    {
        try {
            // Récupération des images publiques
            $images = $imageRepository->findBy(['isPublic' => true]);

            // Sérialisation des images
            $json = $serializer->serialize($images, 'json', ['groups' => 'image:read']);
            return new Response($json, Response::HTTP_OK, ['Content-Type' => 'application/json']);
        } catch (\Exception $e) {
            // Gestion des autres types d'erreurs
            return $this->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/user-images', name: 'user_images', methods: ['GET'])]
    public function getUserImages(ImageRepository $imageRepository, SerializerInterface $serializer): Response
    {
        try {
            // Récupération des images publiques
            $images = $imageRepository->findBy(['owner' => $this->getUser()]);

            // Sérialisation des images
            $json = $serializer->serialize($images, 'json', ['groups' => 'image:read']);
            return new Response($json, Response::HTTP_OK, ['Content-Type' => 'application/json']);
        } catch (\Exception $e) {
            // Gestion des autres types d'erreurs
            return $this->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    #[Route('/api/view-images/{uniqueId}', name: 'view_image')]
    public function viewImage(string $uniqueId, ImageRepository $repository, UploaderHelper $helper): Response
    {
        try {
            // Tente de trouver l'image par son uniqueId           
            $image = $repository->findOneBy(['uniqueId' => $uniqueId]);

            // Vérifie si l'image est disponible et publique
            if (!$image) {
                return $this->json(['error' => 'Image not found or not accessible.'], Response::HTTP_NOT_FOUND);
            }

            // Récupère le chemin d'accès au fichier
            $path = $helper->asset($image, 'imageFile');
            if (!$path) {
                return $this->json(['error' => 'Image file path could not be determined.'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // Construit le chemin complet
            $filePath = $this->getParameter('kernel.project_dir') . "/public" . $path;
            if (!file_exists($filePath)) {
                return $this->json(['error' => 'File does not exist on the server.'], Response::HTTP_NOT_FOUND);
            }

            // Retourne le fichier en réponse
            return new BinaryFileResponse($filePath, Response::HTTP_OK);
        } catch (\Exception $e) {
            // Gestion des erreurs non spécifiques
            return $this->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/delete-image/{uniqueId}', name: 'delete_image', methods: ['DELETE'])]
    public function deleteImage(string $uniqueId, ImageRepository $imageRepository, EntityManagerInterface $entityManager, UploaderHelper $helper): Response
    {
        try {
            // Récupération de l'image par son uniqueId
            $image = $imageRepository->findOneBy(['uniqueId' => $uniqueId]);

            // Vérifie si l'image existe et si l'utilisateur est le propriétaire
            if (!$image) {
                return $this->json(['error' => 'Image not found.'], Response::HTTP_NOT_FOUND);
            }

            if ($image->getOwner() !== $this->getUser()) {
                return $this->json(['error' => 'You do not have permission to delete this image.'], Response::HTTP_FORBIDDEN);
            }

            // Suppression de l'image
            $path = $helper->asset($image, 'imageFile');
            if (!$path) {
                return $this->json(['error' => 'Image file path could not be determined.'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            $filePath = $this->getParameter('kernel.project_dir') . "/public" . $path;

            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Remove the image entity from the database
            $entityManager->remove($image);
            $entityManager->flush();

            return $this->json(['message' => 'Image successfully deleted.'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/update-image-status', name: 'update_image_status', methods: ['PUT'])]
    public function updateImageStatus(Request $request, ImageRepository $imageRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): Response
    {
        try {
            $dto = $serializer->deserialize($request->getContent(), ImageStatusDTO::class, 'json');

            // Validation du DTO
            $errors = $validator->validate($dto);
            if (count($errors) > 0) {
                return $this->json($errors, Response::HTTP_BAD_REQUEST);
            }

            // Recherche de l'image correspondante
            $image = $imageRepository->findOneBy(['uniqueId' => $dto->uniqueId]);
            if (!$image) {
                return $this->json(['error' => 'Image not found.'], Response::HTTP_NOT_FOUND);
            }

            // Mise à jour du statut isPublic
            $image->setIsPublic($dto->isPublic);
            $entityManager->flush();

            // Renvoi de l'image mise à jour
            return $this->json(
                ['message' => 'Image status updated successfully', 'image' => $serializer->serialize($image, 'json', ['groups' => 'image:read'])],
                Response::HTTP_OK,
                ['Content-Type' => 'application/json']
            );
        } catch (\Exception $e) {
            return $this->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
