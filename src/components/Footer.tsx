const Footer = () => {
  return (
    <footer className="bg-card border-t border-border p-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} ProblemHub. All rights reserved.
    </footer>
  );
};

export default Footer;