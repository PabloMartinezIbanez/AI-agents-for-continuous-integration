from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'src' / 'calculator'))
import suma

def test_suma():
    assert suma.suma(1, 2) == 3

def test_resta():
    assert suma.resta(1, 2) == -1

def test_fallo_suma():
    assert suma.suma(1, 2) == 3

def test_fallo_resta():
    assert suma.resta(1, 2) == -1
