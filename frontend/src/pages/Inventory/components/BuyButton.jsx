import Button from '../../../components/common/Button.jsx';

export default function BuyButton({ cost, affordable, onClick, loading }) {
  return (
    <Button
      size="sm"
      variant="gold"
      onClick={onClick}
      loading={loading}
      disabled={!affordable}
      className="w-full"
    >
      {affordable ? `Buy for ${cost}g` : `Need ${cost}g`}
    </Button>
  );
}
