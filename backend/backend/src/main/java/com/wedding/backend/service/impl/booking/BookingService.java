package com.wedding.backend.service.impl.booking;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.bookingService.BookingServiceDTO;
import com.wedding.backend.entity.BookingEntity;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.exception.ResourceNotFoundException;
import com.wedding.backend.mapper.BookingServiceMapper;
import com.wedding.backend.repository.BookingRepository;
import com.wedding.backend.repository.ServiceRepository;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.service.IService.booking.IBookingService;
import com.wedding.backend.util.message.MessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class BookingService implements IBookingService {

    private final BookingRepository bookingRepository;
    private final BookingServiceMapper mapper;
    private final ServiceRepository serviceRepository;
    private final SupplierRepository supplierRepository;

    @Override
    public BaseResult addBooking(BookingServiceDTO bookingServiceDTO) {
        try {
            BookingEntity booking = mapper.dtoToEntity(bookingServiceDTO);
            Optional<ServiceEntity> service = serviceRepository.findById(bookingServiceDTO.getServiceId());
            service.ifPresent(booking::setServerBooking);
            bookingRepository.save(booking);
            return new BaseResult(true, MessageUtil.MSG_SEND_BOOKING_SUCCESS);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @Override
    public BaseResultWithDataAndCount<List<BookingServiceDTO>> getBookingServiceBySupplierId(Principal connectedUser) {
        BaseResultWithDataAndCount<List<BookingServiceDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
            if (supplier.isPresent()) {
                List<BookingServiceDTO> resultFromDb = bookingRepository.findByServerBooking_Supplier_Id(supplier.get().getId());
                result.set(resultFromDb,(long) resultFromDb.size());
            } else {
                throw new ResourceNotFoundException(MessageUtil.SUPPLIER_NOT_FOUND);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }
}
