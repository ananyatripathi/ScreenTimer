import React from 'react'
import { Switch, Route } from 'react-router-dom'
import IdleTimer from 'react-idle-timer';
import { DashboardPage } from './dashboard/Dashboard'
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class Layout extends React.Component {


    constructor(props){
        super(props)

        this.state = {
            timeout:1000 * 5 * 1,
            isTimedOut: false,
            timerOn: true,
            timerStart: 0,
            timerTime: 0
        }

        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
    }
    startTimer = () => {
      this.setState({
        timerOn: true,
        timerTime: this.state.timerTime,
        timerStart: Date.now() - this.state.timerTime
      });
      this.timer = setInterval(() => {
        this.setState({
          timerTime: Date.now() - this.state.timerStart
        });
      }, 10);
    };

    stopTimer = () => {
      this.setState({ timerOn: false });
      clearInterval(this.timer);
    };
  
    resetTimer = () => {
      this.setState({
        timerStart: 0,
        timerTime: 0
      });
    };

    _onAction(e) {
      console.log('user did something', e)
      this.setState({isTimedOut: false})
    }
   
    _onActive(e) {
      console.log('user is active', e)
      this.setState({isTimedOut: false})
      this.startTimer()
    }
   
    _onIdle(e) {
      console.log('user is idle', e)
      const isTimedOut = this.state.isTimedOut
      if (isTimedOut) {
          this.props.history.push('/')
      } 
      this.setState({ timerOn: false });
      clearInterval(this.timer);
      
    }


    render(){
      const { match } = this.props
      const { timerTime } = this.state;
      let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
      let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
      let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
      let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);



      return(
        <>
         


          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />

      <div className="Stopwatch">
        <div className="Stopwatch-display">
          {hours} : {minutes} : {seconds} : {centiseconds}
        </div>
       

        {this.state.timerOn === true && this.state.timerTime === 0 && (
          <button onClick={this.startTimer}>Start</button>
        )}


        {/* {this.state.timerOn === true && (
          <button onClick={this.stopTimer}>Stop</button>
        )}
        {this.state.timerOn === false && this.state.timerTime > 0 && (
          <button onClick={this.startTimer}>Resume</button>
        )}
        {this.state.timerOn === false && this.state.timerTime > 0 && (
          <button onClick={this.resetTimer}>Reset</button>
        )} */}
      </div>











            <div className="">
                <Switch>
                    <Route 
                        exact path={`${match.path}dashboard`}
                        render={(props) => <DashboardPage {...props} /> }/>
                </Switch>
                
            </div>
        </>
      )
   }

 }

 Layout.propTypes = {
     match: PropTypes.any.isRequired,
     history: PropTypes.func.isRequired
 }

export default Layout