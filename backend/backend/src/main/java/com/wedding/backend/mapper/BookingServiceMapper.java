package com.wedding.backend.mapper;

import com.wedding.backend.dto.bookingService.BookingServiceDTO;
import com.wedding.backend.entity.BookingEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingServiceMapper {
    BookingServiceDTO entityToDto(BookingEntity booking);

    BookingEntity dtoToEntity(BookingServiceDTO bookingServiceDTO);
}
