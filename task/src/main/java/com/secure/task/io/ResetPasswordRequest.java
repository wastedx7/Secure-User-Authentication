package com.secure.task.io;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    
    @NotBlank(message = "email cannot be blank")
    private String email;
    @NotBlank(message = "new password cannot be blank")
    private String newPassword;
    @NotBlank(message = "otp cannot be blank")
    private String otp;
}
