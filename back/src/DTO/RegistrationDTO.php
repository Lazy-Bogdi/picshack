<?php
namespace App\DTO;

class RegistrationDTO
{
    public string $username; //email
    public string $name; // actual username that'll be shown
    public string $password;
    public string $passwordConfirmation;
}
