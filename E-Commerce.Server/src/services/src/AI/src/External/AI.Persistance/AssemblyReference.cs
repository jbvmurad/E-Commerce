using System.Reflection;

namespace AI.Persistance;

public static class AssemblyReference
{
    public static readonly Assembly assembly = typeof(Assembly).Assembly;
}
