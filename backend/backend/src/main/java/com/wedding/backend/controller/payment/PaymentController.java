package com.wedding.backend.controller.payment;

import com.wedding.backend.base.BaseResponse;
import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.dto.payment.PaymentDto;
import com.wedding.backend.dto.payment.PaymentResultData;
import com.wedding.backend.dto.payment.PaymentReturnDto;
import com.wedding.backend.dto.payment.ViewPaymentReturnDto;
import com.wedding.backend.dto.response.VnpayPayIpnResponse;
import com.wedding.backend.dto.response.VnpayPayResponse;
import com.wedding.backend.service.IService.payment.IPaymentService;
import com.wedding.backend.util.extensions.ObjectExtension;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController {

    public final IPaymentService paymentService;

    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPLIER','ROLE_ADMIN')")
    @PostMapping()
    public ResponseEntity<?> create(@RequestBody PaymentDto request, Principal connectedUser) {
        return paymentService.createPayment(request, connectedUser);
    }

    @GetMapping(value = "/vnpay-return")
    public void vnpayReturn(@ModelAttribute VnpayPayResponse response, HttpServletResponse httpServletResponse) throws IOException {
        //TODO: Đầu sử lý IPN
        BaseResultWithData<VnpayPayIpnResponse> resultIpn = paymentService.vnpayReturnIpn(response);
        if (resultIpn.getData().getRspCode().equals("00")) {
            //TODO: Đầu return view
            ResponseEntity<?> responseEntity = paymentService.processVnpayPaymentReturn(response);
            String returnUrl = "";
            PaymentReturnDto model = null;
            if (responseEntity.getStatusCode().is2xxSuccessful()) {
                BaseResultWithData<PaymentResultData> convertResponse = (BaseResultWithData<PaymentResultData>) responseEntity.getBody();
                returnUrl = convertResponse.getData().getReturnUrl();
                model = convertResponse.getData().getReturnDto();

                if (returnUrl.endsWith("/")) {
                    returnUrl = returnUrl.substring(0, returnUrl.length() - 1);
                }
                String queryString = ObjectExtension.toQueryString(model);
                httpServletResponse.sendRedirect(returnUrl + "?" + queryString);
            }
        }
    }

    @GetMapping(value = "/vpn-ipn")
    public BaseResultWithData<VnpayPayIpnResponse> vnpReturnIpn(@ModelAttribute VnpayPayResponse response) {
        return paymentService.vnpayReturnIpn(response);
    }

    @GetMapping(value = "/vnpay-return-view")
    public void vnpayReturnView(@ModelAttribute ViewPaymentReturnDto response, HttpServletResponse httpServletResponse) throws IOException {
        ResponseEntity<?> responseEntity = paymentService.vnpayReturnView(response);
        BaseResult baseResult = (BaseResult) responseEntity.getBody();
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("http://localhost:5173/payment/status")
                .queryParam("message", baseResult.getMessage())
                .queryParam("success", baseResult.isSuccess());
        httpServletResponse.sendRedirect(builder.toUriString());
    }

    @GetMapping(value = "/history")
    public ResponseEntity<?> paymentHistory(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                            @RequestParam(name = "size", required = false, defaultValue = "5") Integer size,
                                            Principal connectedUser) {
        Pageable pageable = PageRequest.of(page, size);
        return paymentService.paymentHistory(connectedUser, pageable);
    }
}
