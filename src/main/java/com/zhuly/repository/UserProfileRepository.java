/**
 * 本文件定义 UserProfileRepository 数据访问接口，负责对应业务数据的查询与持久化
 */
package com.zhuly.repository;

import com.zhuly.domain.UserProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * UserProfileRepository 提供本模块实体的数据库访问和条件查询能力
 */
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // 查询并返回 findByUsername 对应的数据
    Optional<UserProfile> findByUsername(String username);
    // 查询并返回 findByEmail 对应的数据
    Optional<UserProfile> findByEmail(String email);
    // 执行 existsByUsername 方法对应的业务处理
    boolean existsByUsername(String username);
    // 执行 existsByEmail 方法对应的业务处理
    boolean existsByEmail(String email);
}
