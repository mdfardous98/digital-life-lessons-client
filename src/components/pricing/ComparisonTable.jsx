const ComparisonTable = () => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Free</th>
          <th>Premium</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>View Free Lessons</td>
          <td>Yes</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>View Premium Lessons</td>
          <td>No</td>
          <td>Yes</td>
        </tr>

        <tr>
          <td>Create Premium Lessons</td>
          <td>No</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>Ad-Free</td>
          <td>No</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>Analytics</td>
          <td>Basic</td>
          <td>Advanced</td>
        </tr>
        <tr>
          <td>Priority Support</td>
          <td>No</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>Unlimited Storage</td>
          <td>No</td>
          <td>Yes</td>
        </tr>
      </tbody>
    </table>
  );
};
export default ComparisonTable;
