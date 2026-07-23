using System.Reflection;

namespace Security.Presentation;

public static class AssemblyReference
{
    public static readonly Assembly assembly = typeof(Assembly).Assembly;
}
