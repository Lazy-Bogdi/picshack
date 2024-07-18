<?php

namespace App\Controller;

use App\Entity\User;
use App\DTO\RegistrationDTO;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{
    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, SerializerInterface $serializer, ValidatorInterface $validator, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): Response
    {
        try {
            $data = $request->getContent();

            $registrationDTO  = $serializer->deserialize($data, RegistrationDTO::class, 'json');

            // Validation des données
            $errors = $validator->validate($registrationDTO);
            if (count($errors) > 0) {
                return $this->json($errors, Response::HTTP_BAD_REQUEST);
            }

            // Vérifier si le mot de passe et sa confirmation sont identiques
            if ($registrationDTO->password !== $registrationDTO->passwordConfirmation) {
                return $this->json(['error' => 'Password and password confirmation do not match'], Response::HTTP_BAD_REQUEST);
            }
            // dd($registrationDTO->password);

            $user = new User();
            $user->setEmail($registrationDTO->username);
            $user->setName($registrationDTO->name);
            $user->setRoles($user->getRoles());
            $user->setPassword($passwordHasher->hashPassword($user, $registrationDTO->password));


            // Sauvegarde de l'utilisateur
            $em->persist($user);
            $em->flush();

            return $this->json([
                'message' => 'User successfully registered',
                'user' => $serializer->serialize($user, 'json', ['groups' => 'user:read'])
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
