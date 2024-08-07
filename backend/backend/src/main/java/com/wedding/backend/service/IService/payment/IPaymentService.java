package com.wedding.backend.service.IService.payment;

import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.dto.payment.PaymentDto;
import com.wedding.backend.dto.payment.ViewPaymentReturnDto;
import com.wedding.backend.dto.response.VnpayPayIpnResponse;
import com.wedding.backend.dto.response.VnpayPayResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface IPaymentService {
    ResponseEntity<?> createPayment(PaymentDto request, Principal connectedUser);

    ResponseEntity<?> processVnpayPaymentReturn(VnpayPayResponse response);

    BaseResultWithData<VnpayPayIpnResponse> vnpayReturnIpn(VnpayPayResponse response);

    ResponseEntity<?> vnpayReturnView(ViewPaymentReturnDto response);

    ResponseEntity<?> paymentHistory(Principal connectedUser, Pageable pageable);

    ResponseEntity<?> getAllPayment(Pageable pageable);

    ResponseEntity<?> getTotalPaymentTransactionByMonth();
}
