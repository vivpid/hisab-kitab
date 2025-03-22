
const BaseView = (props) => {
  const {userInfo} = props;
  
  return (
    <div>
        <h1>{userInfo.name}</h1>
    </div>
    );
};

export default BaseView;
