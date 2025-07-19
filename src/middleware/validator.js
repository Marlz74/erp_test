import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// Reusable validation middleware generator
export const validateInput = (schema, excludeFromSanitization = []) => {
    const validations = Object.entries(schema).map(([field, rules]) => {
        let validator = body(field);

        // Apply type validation
        if (rules.type === 'string') {
            validator = validator.isString().withMessage(`${field} must be a string`);
        } else if (rules.type === 'integer') {
            validator = validator
                .isInt({ min: rules.min, max: rules.max })
                .withMessage(`${field} must be an integer between ${rules.min} and ${rules.max}`);
        } else if (rules.type === 'email') {
            validator = validator
                .isEmail()
                .normalizeEmail()
                .withMessage(`${field} must be a valid email`);
        } else if (rules.type === 'password' || rules.type === 'token') {
            validator = validator
                .isString()
                .withMessage(`${field} must be a string`);
        }

        // Apply length validation
        if (rules.maxLength) {
            validator = validator
                .isLength({ max: rules.maxLength })
                .withMessage(`${field} must be up to ${rules.maxLength} characters`);
        }

        // Apply sanitization for strings (unless excluded)
        if (
            (rules.type === 'string' || rules.type === 'email') &&
            !excludeFromSanitization.includes(field)
        ) {
            validator = validator.customSanitizer((value) =>
                sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
            );
        }

        // Apply required validation
        if (rules.required) {
            validator = validator
                .notEmpty()
                .withMessage(`${field} is required`);
        }

        return validator;
    });

    // Check for unknown fields
    validations.push(
        body().custom((value, { req }) => {
            const allowedFields = Object.keys(schema);
            const extraFields = Object.keys(req.body).filter(
                (key) => !allowedFields.includes(key)
            );
            if (extraFields.length > 0) {
                throw new Error(`Unknown fields: ${extraFields.join(', ')}`);
            }
            return true;
        })
    );

    return validations;
};

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().map((err) => err.msg).join('; ')
        });
    }
    next();
};