package com.wedding.backend.util.validator;

import java.util.regex.Pattern;

public class PhoneNumberValidator {
    /**
     * Pre: +84
     */
    private static final String PHONE_NUMBER_PATTERN = "^\\+84\\s?\\d{9}$|^\\+84\\s?0\\d{9}$|^\\+84\\s?\\d{8}$";

    public static boolean isValidPhoneNumber(String phoneNumber) {
        // Check if the provided phone number matches the pattern
        return Pattern.matches(PHONE_NUMBER_PATTERN, phoneNumber);
    }


    public static String  normalizeDisplayPhoneNumber(String phoneNumber){
        // Loại bỏ tất cả dấu cách
        phoneNumber = phoneNumber.replaceAll("\\s", "");
        if(phoneNumber.startsWith("+84")){
            phoneNumber = phoneNumber.replaceFirst("^\\+84", "0");
        }
        return phoneNumber;
    }

    public static String normalizePhoneNumber(String phoneNumber) {

        // Remove all space
        phoneNumber = phoneNumber.replaceAll("\\s", "");

        // Remove 0 number after +84 if exiting
        if (phoneNumber.startsWith("+840")) {
            phoneNumber = phoneNumber.replace("+840", "+84");
        } else if (phoneNumber.startsWith("0")) {
            phoneNumber = phoneNumber.replaceFirst("^0+", "");
        }

        // Add pre: +84 if not have
        if (!phoneNumber.startsWith("+84")) {
            phoneNumber = "+84" + phoneNumber;
        }
        return phoneNumber;
    }
}
