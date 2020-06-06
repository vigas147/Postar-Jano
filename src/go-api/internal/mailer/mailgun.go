package mailer

import (
	"bytes"
	"context"
	"os"

	"github.com/MarekVigas/Postar-Jano/internal/mailer/templates"

	"github.com/labstack/echo/v4"
	"github.com/mailgun/mailgun-go/v4"
	"github.com/pkg/errors"

	"go.uber.org/zap"
)

type Client struct {
	logger  *zap.Logger
	mailgun *mailgun.MailgunImpl
}

const (
	mailgunDomain = "MAILGUN_DOMAIN"
	mailgunKey    = "MAILGUN_KEY"
)

func NewClient(logger *zap.Logger) (*Client, error) {
	domain := os.Getenv(mailgunDomain)
	if domain == "" {
		return nil, errors.New("Mailgun domain is not defined.")
	}

	key := os.Getenv(mailgunKey)
	if domain == "" {
		return nil, errors.New("Mailgun key is not defined.")
	}

	return &Client{
		logger:  logger,
		mailgun: mailgun.NewMailgun(domain, key),
	}, nil
}

func (c *Client) InfoMail(ctx context.Context) error {
	var b bytes.Buffer
	data := echo.Map{
		"eventName": "test",
		"name":      "meno",
		"surname":   "priezvisko",
		"street":    "ulica",
		"town":      "mesto",
		"birthday":  "18.8.1992",
		"text":      "text",
		"photoURL":  "http://example.com",
	}

	if err := templates.Info.Execute(&b, data); err != nil {
		return errors.WithStack(err)
	}

	c.send(ctx, "leto2020@sbb.sk", "Info o tabore", b.String(), "Lukas Macko <llukas3@gmail.com>")

	return nil
}

func (c *Client) send(ctx context.Context, sender string, subject string, body string, recipient string) error {
	msg := c.mailgun.NewMessage(sender, subject, "", recipient)
	msg.SetHtml(body)

	resp, id, err := c.mailgun.Send(ctx, msg)
	if err != nil {
		return errors.Wrap(err, "failed to send a message")
	}
	c.logger.Info("Message sent", zap.String("id", id), zap.String("resp", resp))
	return nil
}
