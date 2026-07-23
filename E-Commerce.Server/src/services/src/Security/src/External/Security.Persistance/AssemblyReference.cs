using System.Reflection;

namespace Security.Persistance;

public static class AssemblyReference 
{
    public static readonly Assembly assembly = typeof(Assembly).Assembly;
}
