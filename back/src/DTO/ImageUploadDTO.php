<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageUploadDTO
{
    /**
     * @Assert\NotBlank(message="Please select an image to upload.")
     * @Assert\File(
     *     maxSize = "10M",
     *     mimeTypes = {"image/jpeg", "image/gif", "image/png, "image/jpg", "image/webp"},
     *     mimeTypesMessage = "Please upload a valid image (jpeg, gif, png)"
     * )
     */
    public ?UploadedFile $imageFile = null;
    
    #[Assert\Type(type: "bool")]
    public bool $isPublic = true;
}
