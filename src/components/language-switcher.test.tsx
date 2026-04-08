"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitcher } from "@/components/language-switcher";
import { localeCookieName } from "@/lib/i18n";

describe("LanguageSwitcher", () => {
  it("renders available locales and updates the locale cookie", async () => {
    const user = userEvent.setup();

    render(
      <LanguageSwitcher
        currentLocale="en"
        label="Language"
        locales={[
          { value: "en", label: "English" },
          { value: "pt-PT", label: "Português" },
        ]}
      />,
    );

    await user.selectOptions(screen.getByRole("combobox"), "pt-PT");

    expect(document.cookie).toContain(`${localeCookieName}=pt-PT`);
  });
});
