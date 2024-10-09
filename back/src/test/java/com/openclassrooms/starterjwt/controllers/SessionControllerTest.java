package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Session session;
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();

        session = new Session();
        session.setId(1L);
        session.setName("Test Session");
        session.setDescription("Test Description");
        Date currentDate = Date.from(Instant.now());
        session.setDate(currentDate);

        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Test");
        teacher.setLastName("Teacher");
        session.setTeacher(teacher);

        sessionDto = new SessionDto();
        sessionDto.setId(session.getId());
        sessionDto.setName(session.getName());
        sessionDto.setDescription(session.getDescription());
        sessionDto.setDate(session.getDate());
        sessionDto.setTeacher_id(session.getTeacher().getId());
    }

    @Test
    void testFindById() throws Exception {
        Long sessionId = 1L;

        when(sessionService.getById(sessionId)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(get("/api/session/{id}", sessionId))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDto)));

        verify(sessionService).getById(sessionId);
        verify(sessionMapper).toDto(session);
    }

    @Test
    void testFindAll() throws Exception {
        List<Session> sessions = Arrays.asList(session, session);
        List<SessionDto> sessionDtos = Arrays.asList(sessionDto, sessionDto);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDtos)));

        verify(sessionService).findAll();
        verify(sessionMapper).toDto(sessions);
    }

    @Test
    void testCreate() throws Exception {
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDto)));

        verify(sessionMapper).toEntity(sessionDto);
        verify(sessionService).create(session);
        verify(sessionMapper).toDto(session);
    }

    @Test
    void testUpdate() throws Exception {
        Long sessionId = 1L;

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(eq(sessionId), any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(put("/api/session/{id}", sessionId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(sessionDto)));

        verify(sessionMapper).toEntity(sessionDto);
        verify(sessionService).update(eq(sessionId), any(Session.class));
        verify(sessionMapper).toDto(session);
    }

    @Test
    void testDelete() throws Exception {
        Long sessionId = 1L;

        when(sessionService.getById(sessionId)).thenReturn(session);

        mockMvc.perform(delete("/api/session/{id}", sessionId))
                .andExpect(status().isOk());

        verify(sessionService).getById(sessionId);
        verify(sessionService).delete(sessionId);
    }

    @Test
    void testParticipate() throws Exception {
        Long sessionId = 1L;
        Long userId = 2L;

        doNothing().when(sessionService).participate(sessionId, userId);

        mockMvc.perform(post("/api/session/{id}/participate/{userId}", sessionId, userId))
                .andExpect(status().isOk());

        verify(sessionService).participate(sessionId, userId);
    }

    @Test
    void testNoLongerParticipate() throws Exception {
        Long sessionId = 1L;
        Long userId = 2L;

        doNothing().when(sessionService).noLongerParticipate(sessionId, userId);

        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", sessionId, userId))
                .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(sessionId, userId);
    }
}
