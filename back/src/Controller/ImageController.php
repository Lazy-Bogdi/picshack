<?php

namespace App\Controller;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use App\DTO\ImageUploadDTO;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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
            $image->setImageFile($dto->imageFile);
            $image->setCreatedAt(new \DateTimeImmutable());
            $image->setIsPublic($dto->isPublic);
            $image->setOwner($this->getUser()); // Utilisation de getOwner si votre entité utilise cette méthode

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
}
