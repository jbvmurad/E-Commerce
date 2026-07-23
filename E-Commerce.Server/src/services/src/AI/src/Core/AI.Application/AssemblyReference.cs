using System.Reflection;

namespace AI.Application;

public static class AssemblyReference
{
    public static readonly Assembly assembly = typeof(Assembly).Assembly;
}
