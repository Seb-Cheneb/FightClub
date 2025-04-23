namespace API.Services;

public class LogService
{
    private string _className;

    public LogService(string className)
    {
        _className = className;
    }

    public string LogError(string message)
    { return ""; }
}