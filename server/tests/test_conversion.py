def test_conversion_module_imports():
    from app.services.conversion_service import convert_file
    assert callable(convert_file)
