package com.wedding.backend.service.impl.booking;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.dto.bookingService.BookingServiceDTO;
import com.wedding.backend.dto.bookingService.BookingServicesBySupplier;
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
            //TODO: Find if phone && serviceId && status == success found => Rejected
            List<BookingEntity> dataFromDb = bookingRepository.findAllByServerBooking_IdAndPhoneNumberAndStatus(bookingServiceDTO.getServiceId(), bookingServiceDTO.getPhoneNumber(), StatusCommon.PROCESS);
            if (dataFromDb.isEmpty()) {
                BookingEntity booking = mapper.dtoToEntity(bookingServiceDTO);
                Optional<ServiceEntity> service = serviceRepository.findById(bookingServiceDTO.getServiceId());
                service.ifPresent(booking::setServerBooking);
                booking.setStatus(StatusCommon.PROCESS);
                bookingRepository.save(booking);
                return new BaseResult(true, MessageUtil.MSG_SEND_BOOKING_SUCCESS);
            } else {
                return new BaseResult(true, MessageUtil.MSG_FOUND_BOOKING);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @Override
    public BaseResultWithDataAndCount<List<BookingServicesBySupplier>> getBookingServiceBySupplierId(Principal connectedUser) {
        BaseResultWithDataAndCount<List<BookingServicesBySupplier>> result = new BaseResultWithDataAndCount<>();
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
            if (supplier.isPresent()) {
                Long supplierID = supplier.get().getId(); // Changed to 'supplierID'
                List<BookingServicesBySupplier> resultFromDb = bookingRepository.bookingServiceBySupplier(supplierID);
                result.set(resultFromDb, (long) resultFromDb.size());
            } else {
                throw new ResourceNotFoundException(MessageUtil.SUPPLIER_NOT_FOUND);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResult changeStatusBooking(String status, Long bookingId) {
        try {
            Optional<BookingEntity> booking = bookingRepository.findById(bookingId);
            if (booking.isPresent()) {
                if (status.equals(StatusCommon.SUCCESS.name())) {
                    booking.get().setStatus(StatusCommon.SUCCESS);
                } else if (status.equals(StatusCommon.FAILED.name())) {
                    booking.get().setStatus(StatusCommon.FAILED);
                } else if (status.equals(StatusCommon.PROCESS.name())) {
                    booking.get().setStatus(StatusCommon.PROCESS);
                }
                bookingRepository.save(booking.get());
                return new BaseResult(true, MessageUtil.MSG_UPDATE_SUCCESS);
            } else {
                return new BaseResult(false, MessageUtil.BOOKING_NOT_FOUND);
            }
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }
}
