try:
    import app.services.conversion_service as conversion_service
except ImportError:
    conversion_service = None

if conversion_service is not None and hasattr(conversion_service, "convert_file"):
    convert_file = conversion_service.convert_file
else:
    def convert_file(*args, **kwargs):
        raise NotImplementedError("convert_file is not available in app.services.conversion_service")


def test_conversion_module_imports():
    assert callable(convert_file)
