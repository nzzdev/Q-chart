import Chartist from 'chartist';
import './styles.css!'

export function display(item, element) {
  new Chartist.Bar(element, item.data, item.chartConfig);
}
