using System.Linq.Expressions;

namespace JayDash.Repositories.Specifications;

public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
}
