package com.wedding.backend.base;

import lombok.Data;

@Data
public class BaseError {
    private String code = "";
    private String message = "";
}
