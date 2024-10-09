package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>(Arrays.asList(user)));
    }

    @Test
    void testCreateSession() {
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession);
        assertEquals(session.getId(), createdSession.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testGetSession() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(1L);

        assertNotNull(foundSession);
        assertEquals(session.getId(), foundSession.getId());
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetSessionNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        Session foundSession = sessionService.getById(1L);

        assertNull(foundSession);
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetAllSessions() {
        List<Session> sessions = Arrays.asList(session, new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> foundSessions = sessionService.findAll();

        assertNotNull(foundSessions);
        assertEquals(2, foundSessions.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void testUpdateSession() {
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        Session updatedSession = sessionService.update(1L, session);

        assertNotNull(updatedSession);
        assertEquals(session.getId(), updatedSession.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testDeleteSession() {
        doNothing().when(sessionRepository).deleteById(1L);

        sessionService.delete(1L);

        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    void testParticipate() {
        Long sessionId = 1L;
        Long userId = 2L;
        User newUser = new User();
        newUser.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(newUser));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.participate(sessionId, userId);

        assertTrue(session.getUsers().contains(newUser));
        verify(sessionRepository).save(session);
    }

    @Test
    void testParticipateSessionNotFound() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void testParticipateUserNotFound() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void testParticipateAlreadyParticipating() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void testNoLongerParticipate() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        sessionService.noLongerParticipate(sessionId, userId);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository).save(session);
    }

    @Test
    void testNoLongerParticipateSessionNotFound() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }

    @Test
    void testNoLongerParticipateNotParticipating() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }
}
