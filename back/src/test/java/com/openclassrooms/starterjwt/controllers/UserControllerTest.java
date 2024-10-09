package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.core.userdetails.UserDetails;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testFindById() throws Exception {
        Long userId = 1L;
        User user = new User();
        UserDto userDto = new UserDto();

        when(userService.findById(userId)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        mockMvc.perform(get("/api/user/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(userDto)));

        verify(userService).findById(userId);
        verify(userMapper).toDto(user);
    }

    @Test
    void testFindByIdNotFound() throws Exception {
        Long userId = 1L;

        when(userService.findById(userId)).thenReturn(null);

        mockMvc.perform(get("/api/user/{id}", userId))
                .andExpect(status().isNotFound());

        verify(userService).findById(userId);
    }

    @Test
    void testFindByIdBadRequest() throws Exception {
        mockMvc.perform(get("/api/user/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteUser() throws Exception {
        Long userId = 1L;
        String userEmail = "test@test.com";

        User user = new User();
        user.setId(userId);
        user.setEmail(userEmail);

        when(userService.findById(userId)).thenReturn(user);
        doNothing().when(userService).delete(userId);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(userEmail);

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        mockMvc.perform(delete("/api/user/{id}", userId)
                .with(SecurityMockMvcRequestPostProcessors.user(userDetails)))
                .andExpect(status().isOk());

        verify(userService).findById(userId);
        verify(userService).delete(userId);
    }

    @Test
    void testDeleteUserNotFound() throws Exception {
        Long userId = 1L;

        when(userService.findById(userId)).thenReturn(null);

        mockMvc.perform(delete("/api/user/{id}", userId))
                .andExpect(status().isNotFound());

        verify(userService).findById(userId);
        verify(userService, never()).delete(userId);
    }
}
