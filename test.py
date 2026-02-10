import pytest
import suma

def test_suma():
    assert suma.suma(1, 2) == 3

def test_suma_error():
    assert suma.suma(1, 2) == 4