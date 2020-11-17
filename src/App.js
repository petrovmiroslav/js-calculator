import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <main>
        <Calculator/>
      </main>
      <Footer/>
    </div>
  );
}

class Calculator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      sum: 0,
      input: '',
      output: 0,
      operator: '',
      error: false
    };

    this.digitsHeadler = this.digitsHeadler.bind(this);
    this.serviceHeadler = this.serviceHeadler.bind(this);
    this.operatorsHeadler = this.operatorsHeadler.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
  }

  serviceHeadler (e) {
    let service = e.currentTarget.id,
        input = this.state.input,
        sum = this.state.sum;
    switch (service) {
      case 'AC':
        (input === '' || input === '0') ? sum = 0 : input = 0;
        break;
      case '+/-':
        input === '' ? sum = sum * -1 : input = input * -1;
        break;
      case '%':
        input !== '' && (this.state.operator === '+' || this.state.operator === '-') 
            ? input = sum / 100 * input
            : input = input / 100;  
        break;
      default :
        return this.errorHandler();
    }
    this.setState({
      sum: sum,
      input: input,
      error: false
    });
  }

  operatorsHeadler (e) {
    let operator = this.state.operator, 
        input = this.state.input === '' ? operator = '' : +this.state.input,
        sum = this.state.sum;
    switch (operator) {
      case '\u00F7':
        sum = (sum * 10) / (input * 10);
        break;
      case '\u00D7':
        sum = ((sum * 10) * (input * 10)) / 100;
        break;
      case '-':
        sum = (sum * 10 - input * 10) / 10;
        break;
      case '+':
        sum = (sum * 10 + input * 10) / 10;
        break;
      case '=':
        sum = input;
        break;
      default:
        sum = input === '' ? sum : input;
    }
    if (Number.isNaN(sum) || !isFinite(sum)) return this.errorHandler();
    this.setState({
      operator: e.currentTarget.id,
      sum: sum,
      input: '',
      error: false});
  }

  errorHandler () {
    this.setState({
      sum: 0,
      input: '',
      output: 0,
      operator: '', 
      error: true
    });
  }

  digitsHeadler (e) {
    let input = this.state.input.toString(),
        value = e.currentTarget.id.toString(),
        isDecimal = input.indexOf('.') === -1 ? !1 : !0;
    (value === '.' && input === '') && (input = '0');
    (value === '.' && isDecimal) && (value = '');
    (input === '0' && value !== '.') && (input = '');
    if ((input.length === 9 && !isDecimal) || input.length > 9) value = '';
    this.setState({
      input: (input + value).toString(),
      error: false});
  }

  render () {
    return (
      <section className='calculator'>
        <Display 
          sum={this.state.sum} 
          input={this.state.input} 
          error={this.state.error}/>
        <Keyboard
          serviceHeadler={this.serviceHeadler}
          operatorsHeadler={this.operatorsHeadler}
          digitsHeadler={this.digitsHeadler}/>
      </section>
    );
  }
}

function Display (props) {
  let output;
  if (!props.error) {
    output = props.input === '' ? props.sum.toString() : props.input.toString();
    let l = output.length,
        i = output.indexOf('.');
    if (l > 9 && (i === -1 || i > 9 || output.indexOf('e') !== -1)) {
      output = shortOutput((+output).toExponential(6));
      function shortOutput(toShort) {
        let count = 1;
        toShort.length > 10 && (toShort = shortRec(toShort));
        return toShort;
        function shortRec (val) {
          if (val.length <= 10) return val;
          return shortRec((+output).toExponential(8 - val.indexOf('.') - (++count)));
        }
      }
    } else {
      l > 10 && (output = (+output).toFixed(9 - i));
    }
    output = formatOutput(output);
    function formatOutput (str) {
      if (str.indexOf('e') !== -1) return str;
      let i = str.indexOf('.'),
          a = str.split(''),
          b = i === -1 ? [] : a.splice(i),
          arr = [];
      for (let j = a.reverse().length - 1; j >= 0; j--) {
        arr.push(a[j]);
        if (j > 0 && j % 3 === 0) arr.push(' ');
      }
      return arr.concat(b).join('');
    }
  }
  return (
    <div className='display'>
      {output !== undefined ? output : 'Error'}
    </div>
  );
}

function Keyboard (props) {
  return (
    <div className='keyboard'>
      <Service serviceHeadler={props.serviceHeadler}/>
      <Operators operatorsHeadler={props.operatorsHeadler}/>
      <Digits digitsHeadler={props.digitsHeadler}/>
    </div>
  );
}

function Service (props) {
  let c = 'keyboard__key_service';
  return (
    <div className='keyboard_section keyboard__service'>
      <Key id='AC' value='AC' class={c} clickHandler={props.serviceHeadler}/>
      <Key id='+/-' value='+/-' class={c} clickHandler={props.serviceHeadler}/>
      <Key id='%' value='%' class={c} clickHandler={props.serviceHeadler}/>
    </div>
  );
}

function Operators (props) {
  let c = 'keyboard__key_operator';
  return (
    <div className='keyboard_section keyboard__operators'>
      <Key id={'\u00F7'} value={'\u00F7'} class={c} clickHandler={props.operatorsHeadler}/>
      <Key id={'\u00D7'} value={'\u00D7'} class={c} clickHandler={props.operatorsHeadler}/>
      <Key id='-' value='-' class={c} clickHandler={props.operatorsHeadler}/>
      <Key id='+' value='+' class={c} clickHandler={props.operatorsHeadler}/>
      <Key id='=' value='=' class={c} clickHandler={props.operatorsHeadler}/>
    </div>
  );
}

function Digits (props) {
  let v = [7,8,9,4,5,6,1,2,3,0,'.'],
    keys = [];
  for (var i = 0; i <= 10; i++) {
    keys.push(
      <Key key={i}
        id={v[i]} 
        value={v[i]}
        class={v[i] === 0 ? 'keyboard__key_double' : ''}
        clickHandler={props.digitsHeadler}
      />);
  }
  return (
    <div className='keyboard_section keyboard__digits'>
      {keys}
    </div>
  );
}

function Key (props) {
  return (
    <button 
      id={props.id}
      className={
        props.class 
          ? 'keyboard__key ' + props.class 
          : 'keyboard__key'}
      onClick={props.clickHandler}>
      <div className={
        props.value !== 0 ? 'keyboard__highlight' : ' keyboard__doubleHighlight'
      }/>
      <span className='keyboard__value'>{props.value}</span>
    </button>
  );
}


function Footer () {
  return (
    <footer>
      <a className="footer__link" href="https://www.instagram.com/miroslavpetrov_/" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{verticalAlign: "middle", width: 16}}>
          <path d="M256 49c67 0 75 1 102 2 24 1 38 5 47 9a78 78 0 0129 18 78 78 0 0118 29c4 9 8 23 9 47 1 27 2 35 2 102l-2 102c-1 24-5 38-9 47a83 83 0 01-47 47c-9 4-23 8-47 9-27 1-35 2-102 2l-102-2c-24-1-38-5-47-9a78 78 0 01-29-18 78 78 0 01-18-29c-4-9-8-23-9-47-1-27-2-35-2-102l2-102c1-24 5-38 9-47a78 78 0 0118-29 78 78 0 0129-18c9-4 23-8 47-9 27-1 35-2 102-2m0-45c-68 0-77 0-104 2-27 1-45 5-61 11a123 123 0 00-45 29 123 123 0 00-29 45c-6 16-10 34-11 61-2 27-2 36-2 104l2 104c1 27 5 45 11 61a123 123 0 0029 45 123 123 0 0045 29c16 6 34 10 61 11a1796 1796 0 00208 0c27-1 45-5 61-11a129 129 0 0074-74c6-16 10-34 11-61 2-27 2-36 2-104l-2-104c-1-27-5-45-11-61a123 123 0 00-29-45 123 123 0 00-45-29c-16-6-34-10-61-11-27-2-36-2-104-2z"></path>
          <path d="M256 127a129 129 0 10129 129 129 129 0 00-129-129zm0 213a84 84 0 1184-84 84 84 0 01-84 84z"></path>
          <circle cx="390.5" cy="121.5" r="30.2"></circle>
        </svg> Miroslav Petrov</a>
    </footer>
  );
}
export default App;
