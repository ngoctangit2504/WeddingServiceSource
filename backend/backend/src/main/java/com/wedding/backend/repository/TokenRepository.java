package com.wedding.backend.repository;

import com.wedding.backend.entity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface TokenRepository extends JpaRepository<TokenEntity, Long> {

    @Query("""
                select t from TokenEntity t inner join  UserEntity u on t.userEntity.id = u.id where u.id =:userId and (t.expired = false or t.revoked = false )
            """)
    List<TokenEntity> findAllValidTokensByUser(@Param("userId") String userId);

    Optional<TokenEntity> findByToken(String token);
}
