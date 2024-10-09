package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testFindById() throws Exception {
        Long teacherId = 1L;
        Teacher teacher = new Teacher();
        TeacherDto teacherDto = new TeacherDto();

        when(teacherService.findById(teacherId)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        mockMvc.perform(get("/api/teacher/{id}", teacherId))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(teacherDto)));

        verify(teacherService).findById(teacherId);
        verify(teacherMapper).toDto(teacher);
    }

    @Test
    void testFindByIdNotFound() throws Exception {
        Long teacherId = 1L;

        when(teacherService.findById(teacherId)).thenReturn(null);

        mockMvc.perform(get("/api/teacher/{id}", teacherId))
                .andExpect(status().isNotFound());

        verify(teacherService).findById(teacherId);
    }

    @Test
    void testFindByIdBadRequest() throws Exception {
        mockMvc.perform(get("/api/teacher/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testFindAll() throws Exception {
        List<Teacher> teachers = Arrays.asList(new Teacher(), new Teacher());
        List<TeacherDto> teacherDtos = Arrays.asList(new TeacherDto(), new TeacherDto());

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(teacherDtos)));

        verify(teacherService).findAll();
        verify(teacherMapper).toDto(teachers);
    }
}
