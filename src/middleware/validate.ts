import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express-serve-static-core';

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        const input: any = plainToInstance(type, req.body);
        validate(input).then((errors: ValidationError[]) => {
            // Custom check: Ensure at least one field is provided
            if (!input.email && !input.phoneNumber) {
                res.status(400).json({ errors: ['Either email or phoneNumber must be provided.'] });
                return;
            }

            if (errors.length > 0) {
                const messages = errors.map(error => Object.values(error.constraints || {})).flat();
                res.status(400).json({ errors: messages });
            } else {
                next();
            }
        });
    };
}