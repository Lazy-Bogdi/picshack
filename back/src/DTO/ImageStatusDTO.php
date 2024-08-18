<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ImageStatusDTO
{
    #[Assert\NotBlank]
    public ?string $uniqueId = null;

    #[Assert\Type(type: "bool")]
    public ?bool $isPublic = null;
}
