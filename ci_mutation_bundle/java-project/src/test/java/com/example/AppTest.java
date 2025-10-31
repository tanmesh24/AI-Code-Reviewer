package com.example;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class AppTest {
    @Test void testAdd(){ assertEquals(5, App.add(2,3)); }
    @Test void testIsPositive(){ assertTrue(App.isPositive(1)); assertFalse(App.isPositive(0)); }
}
