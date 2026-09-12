import Button from '../../../components/common/Button.jsx';

export default function EquipButton({ onClick, loading }) {
  return (
    <Button size="sm" variant="ghost" onClick={onClick} loading={loading} className="w-full">
      Equip
    </Button>
  );
}
