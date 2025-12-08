const PlanCard = ({ plan }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{plan.title}</h2>
        <p className="text-3xl font-bold">{plan.price}</p>
        <ul className="list-disc pl-5">
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default PlanCard;
