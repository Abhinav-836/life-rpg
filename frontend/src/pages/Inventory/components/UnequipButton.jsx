import Button from '../../../components/common/Button.jsx';

export default function UnequipButton({ onClick, loading }) {
  return (
    <Button size="sm" variant="subtle" onClick={onClick} loading={loading} className="w-full">
      Unequip
    </Button>
  );
}
