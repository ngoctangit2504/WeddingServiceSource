package com.wedding.backend.base;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseResult {
    private boolean success;
    private String message = "";
}
