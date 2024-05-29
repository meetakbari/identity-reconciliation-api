import { IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateContactDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Matches(/^\d{10,15}$/, { message: 'phoneNumber must be a valid phone number without country code and between 10-15 digits' })
    phoneNumber?: string;
}