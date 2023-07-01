import React from "react";

class TimeIncrement extends React.Component<any> {
  constructor(props: any) {
    super(props);

    this.logTime = this.logTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
  }

  logTime() {
    this.props.logTime(this.props.taskId, this.props.timeSegment);
  }

  removeTime() {
    this.props.removeTime(this.props.taskId, this.props.timeSegment);
  }

  render() {
    if (this.props.logged) {
      return <div className="increment logged" onClick={this.removeTime} />;
    } else {
      return <div className="increment" onClick={this.logTime} />;
    }
  }
}

export default TimeIncrement;
