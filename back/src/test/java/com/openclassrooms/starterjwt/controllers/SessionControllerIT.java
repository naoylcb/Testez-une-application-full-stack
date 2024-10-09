package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Date;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Session testSession;
    private User testUser;
    private Teacher testTeacher;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();
        teacherRepository.deleteAll();

        testUser = new User();
        testUser.setEmail("test@test.com");
        testUser.setLastName("Test");
        testUser.setFirstName("User");
        testUser.setPassword("password");
        testUser = userRepository.save(testUser);

        testTeacher = new Teacher();
        testTeacher.setLastName("Doe");
        testTeacher.setFirstName("John");
        testTeacher = teacherRepository.save(testTeacher);

        testSession = new Session();
        testSession.setName("Test Session");
        testSession.setDate(new Date());
        testSession.setDescription("Test Description");
        testSession.setTeacher(testTeacher);
        testSession = sessionRepository.save(testSession);
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    void testFindById() throws Exception {
        mockMvc.perform(get("/api/session/{id}", testSession.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testSession.getId()))
                .andExpect(jsonPath("$.name").value(testSession.getName()));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    void testFindAll() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testSession.getId()))
                .andExpect(jsonPath("$[0].name").value(testSession.getName()));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    void testUpdate() throws Exception {
        SessionDto updatedSession = new SessionDto();
        updatedSession.setName("Updated Session");
        updatedSession.setDescription("Updated Description");
        updatedSession.setDate(new Date());
        updatedSession.setTeacher_id(testTeacher.getId());

        mockMvc.perform(put("/api/session/{id}", testSession.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedSession)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"))
                .andExpect(jsonPath("$.description").value("Updated Description"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    void testParticipate() throws Exception {
        mockMvc.perform(post("/api/session/{id}/participate/{userId}", testSession.getId(), testUser.getId()))
                .andExpect(status().isOk());

        Session updatedSession = sessionRepository.findById(testSession.getId()).orElseThrow();
        assert(updatedSession.getUsers().contains(testUser));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    void testNoLongerParticipate() throws Exception {
        testSession.setUsers(new ArrayList<>());
        testSession.getUsers().add(testUser);
        sessionRepository.save(testSession);

        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", testSession.getId(), testUser.getId()))
                .andExpect(status().isOk());

        Session updatedSession = sessionRepository.findById(testSession.getId()).orElseThrow();
        assertFalse(updatedSession.getUsers().contains(testUser));
    }
}