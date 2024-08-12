package com.wedding.backend.dto.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpSertServiceDTO {
    private Long id;
    private String title;
    private String information;
    private String image;
    private String address;
    private String linkWebsite;
    private String linkFacebook;
    private String rotation;
    private Long serviceTypeId;
}
