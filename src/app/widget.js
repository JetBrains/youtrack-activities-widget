import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ConfigurationForm
  from '@jetbrains/hub-widget-ui/dist/configuration-form';
import Select from '@jetbrains/ring-ui/components/select/select';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';

import styles from './app.css';
import sayHello from './say-hello';

const COLOR_OPTIONS = [
  {key: 'black', label: 'Black'},
  {key: 'red', label: 'Red'},
  {key: 'blue', label: 'Blue'}
];

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false,
      selectedColor: null
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true})
      // onRefresh: () => console.log('Unsupported yet')
    });

    this.initialize(dashboardApi);
  }

  initialize(dashboardApi) {
    dashboardApi.readConfig().then(config => {
      if (!config) {
        return;
      }
      this.setState({selectedColor: config.selectedColor});
    });
  }

  saveConfig = async () => {
    const {selectedColor} = this.state;
    await this.props.dashboardApi.storeConfig({selectedColor});
    this.setState({isConfiguring: false});
  };

  cancelConfig = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  changeColor = selectedColor => this.setState({selectedColor});

  renderConfiguration() {
    const {selectedColor} = this.state;

    return (
      <div className={styles.widget}>
        <ConfigurationForm
          onSave={this.saveConfig}
          onCancel={this.cancelConfig}
        >
          <Select
            size={Select.Size.FULL}
            data={COLOR_OPTIONS}
            selected={selectedColor}
            onChange={this.changeColor}
            label="Select text color"
          />
        </ConfigurationForm>
      </div>
    );
  }

  render() {
    const {selectedColor, isConfiguring} = this.state;

    if (isConfiguring) {
      return this.renderConfiguration();
    }

    return (
      <div className={styles.widget}>
        {selectedColor
          ? <h1 style={{color: selectedColor.key}}>{sayHello()}</h1>
          : (
            <EmptyWidget
              face={EmptyWidgetFaces.JOY}
              message={'Select "Edit..." option in widget dropdown to configure text color'}
            />
          )}
      </div>
    );
  }
}

export default Widget;
