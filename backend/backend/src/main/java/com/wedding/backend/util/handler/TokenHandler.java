package com.wedding.backend.util.handler;


import com.wedding.backend.dto.auth.TokenTypeDTO;
import com.wedding.backend.entity.TokenEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TokenHandler {
    @Autowired
    private TokenRepository tokenRepository;
    public void saveUserToken(Optional<UserEntity> user, String jwtToken) {
        var token = TokenEntity.builder()
                .userEntity(user.get())
                .token(jwtToken)
                .tokeType(TokenTypeDTO.BEARER)
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }

    /*
    * get all token of user
    * If user have any token -> set token is expired
    * */
    public void revokeAllUserTokens(UserEntity user){
        var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if(validUserTokens.isEmpty())
            return;
        validUserTokens.forEach( t -> {
            t.setRevoked(true);
            t.setExpired(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
}
