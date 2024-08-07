package com.wedding.backend.base;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaseResultWithDataAndCount<T> {
    private Long count;
    private T data;

    public void set(T data, Long count) {
        this.data = data;
        this.count = count;
    }
}
