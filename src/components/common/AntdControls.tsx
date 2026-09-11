import {
  Button,
  DatePicker,
  Input,
  Modal,
  Table,
  Tooltip,
  type ButtonProps,
  type DatePickerProps,
  type InputProps,
  type ModalProps,
  type TableProps,
  type TooltipProps,
} from 'antd';

export const AppButton = (props: ButtonProps) => <Button {...props} />;

export const AppModal = (props: ModalProps) => <Modal {...props} />;

export const AppInput = (props: InputProps) => <Input {...props} />;

export const AppDatePicker = (props: DatePickerProps) => <DatePicker {...props} />;

export const AppTooltip = (props: TooltipProps) => <Tooltip {...props} />;

export const AppTable = <RecordType extends object = object,>(
  props: TableProps<RecordType>,
) => <Table<RecordType> {...props} />;
