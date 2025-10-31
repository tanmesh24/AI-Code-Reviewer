from app.calculator import add, is_positive

def test_add():
    assert add(2, 3) == 5

def test_is_positive():
    assert is_positive(5)
    assert not is_positive(0)
